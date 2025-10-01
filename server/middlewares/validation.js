import { createError } from "../error.js";

// Video upload validation
export const validateVideoUpload = (req, res, next) => {
  console.log("Validation middleware - req.body:", req.body);
  console.log("Validation middleware - req.files:", req.files);

  const { title, desc } = req.body;

  if (!title || title.trim().length < 3) {
    return next(
      createError(400, "Video title must be at least 3 characters long")
    );
  }

  // Only check that desc is present and not empty
  if (!desc || desc.trim().length === 0) {
    return next(createError(400, "Video description is required"));
  }

  if (title.length > 100) {
    return next(createError(400, "Video title cannot exceed 100 characters"));
  }

  if (desc.length > 1000) {
    return next(
      createError(400, "Video description cannot exceed 1000 characters")
    );
  }

  // Also validate that files are present
  if (!req.files || !req.files.videoFile || !req.files.imgFile) {
    return next(
      createError(400, "Both video and thumbnail files are required")
    );
  }

  next();
};

// Video update validation (for partial updates without files)
export const validateVideoUpdate = (req, res, next) => {
  console.log("Video update validation - req.body:", req.body);

  const { title, desc, tags } = req.body;

  // Validate title if provided
  if (title !== undefined) {
    if (!title || title.trim().length < 3) {
      return next(
        createError(400, "Video title must be at least 3 characters long")
      );
    }
    if (title.length > 100) {
      return next(createError(400, "Video title cannot exceed 100 characters"));
    }
  }

  // Validate description if provided
  if (desc !== undefined) {
    if (!desc || desc.trim().length === 0) {
      return next(createError(400, "Video description cannot be empty"));
    }
    if (desc.length > 1000) {
      return next(
        createError(400, "Video description cannot exceed 1000 characters")
      );
    }
  }

  // Validate tags if provided
  if (tags !== undefined) {
    if (!Array.isArray(tags) || tags.length === 0) {
      return next(createError(400, "Tags must be a non-empty array"));
    }
    if (tags.some((tag) => !tag || tag.trim().length === 0)) {
      return next(createError(400, "All tags must be non-empty"));
    }
  }

  // Ensure at least one field is being updated
  if (!title && !desc && !tags) {
    return next(
      createError(
        400,
        "At least one field (title, desc, or tags) must be provided for update"
      )
    );
  }

  next();
};

// User registration validation
export const validateUserRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 3) {
    return next(
      createError(400, "Username must be at least 3 characters long")
    );
  }

  if (!email || !email.includes("@")) {
    return next(createError(400, "Please provide a valid email address"));
  }

  if (!password || password.length < 6) {
    return next(
      createError(400, "Password must be at least 6 characters long")
    );
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(createError(400, "Please provide a valid email format"));
  }

  next();
};

// Search query validation
export const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    return next(createError(400, "Search query cannot be empty"));
  }

  if (q.trim().length < 2) {
    return next(
      createError(400, "Search query must be at least 2 characters long")
    );
  }

  if (q.length > 100) {
    return next(createError(400, "Search query cannot exceed 100 characters"));
  }

  // Sanitize search query
  req.query.q = q.trim();

  next();
};

// Comment validation
export const validateComment = (req, res, next) => {
  const { desc } = req.body;

  if (!desc || desc.trim().length === 0) {
    return next(createError(400, "Comment cannot be empty"));
  }

  if (desc.trim().length < 1) {
    return next(createError(400, "Comment must have content"));
  }

  if (desc.length > 500) {
    return next(createError(400, "Comment cannot exceed 500 characters"));
  }

  next();
};

// Channel creation validation
export const validateChannelCreation = (req, res, next) => {
  const { name, description } = req.body;

  if (!name || name.trim().length < 3) {
    return next(
      createError(400, "Channel name must be at least 3 characters long")
    );
  }

  if (name.length > 50) {
    return next(createError(400, "Channel name cannot exceed 50 characters"));
  }

  if (description && description.length > 500) {
    return next(
      createError(400, "Channel description cannot exceed 500 characters")
    );
  }

  next();
};
