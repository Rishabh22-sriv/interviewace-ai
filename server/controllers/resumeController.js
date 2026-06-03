const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const cloudinary = require('../config/cloudinary');
const { analyzeResume } = require('../services/geminiService');

// Extract text from PDF using pdf-parse
const extractTextFromPDF = async (filePath) => {
  try {
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
};

// @desc    Upload and analyze resume
// @route   POST /api/resume/upload
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    // Extract text from the uploaded PDF
    const extractedText = await extractTextFromPDF(req.file.path);

    if (!extractedText || extractedText.trim().length < 50) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF. Please ensure the PDF is not scanned/image-based.',
      });
    }

    // Upload PDF to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'interviewace/resumes',
      resource_type: 'raw',
      format: 'pdf',
    });

    // Clean up temp file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Create resume document
    const resume = await Resume.create({
      userId: req.user.id,
      originalFilename: req.file.originalname,
      resumeUrl: cloudinaryResult.secure_url,
      resumePublicId: cloudinaryResult.public_id,
      extractedText,
      status: 'processing',
    });

    // Analyze with Gemini AI (async)
    res.status(202).json({
      success: true,
      message: 'Resume uploaded, analysis in progress',
      resumeId: resume._id,
    });

    // Run AI analysis in background
    (async () => {
      try {
        const analysis = await analyzeResume(extractedText);

        await Resume.findByIdAndUpdate(resume._id, {
          atsScore: analysis.atsScore,
          feedback: analysis.feedback,
          status: 'completed',
          analyzedAt: new Date(),
        });
      } catch (err) {
        console.error('Resume analysis failed:', err.message);
        await Resume.findByIdAndUpdate(resume._id, { status: 'failed' });
      }
    })();
  } catch (error) {
    // Clean up temp file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get resume analysis status/report
// @route   GET /api/resume/report/:id
const getResumeReport = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).select('-extractedText');

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes for user
// @route   GET /api/resume/history
const getResumeHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-extractedText');

    res.status(200).json({ success: true, resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Delete from Cloudinary
    if (resume.resumePublicId) {
      await cloudinary.uploader.destroy(resume.resumePublicId, { resource_type: 'raw' });
    }

    await resume.deleteOne();
    res.status(200).json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadResume, getResumeReport, getResumeHistory, deleteResume };
