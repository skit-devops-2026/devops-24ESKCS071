export const ALLOWED_TEMPLATES = ['bento', 'terminal', 'executive'];
export const ALLOWED_MODES = ['manual', 'github'];

/**
 * Normalizes a slug to lowercase alphanumeric characters with hyphens.
 * @param {string} slug 
 * @returns {string}
 */
export const sanitizeSlug = (slug) => {
  if (typeof slug !== 'string') return '';
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Validates portfolio creation request payload.
 * Rejects malformed input with descriptive error messages.
 * 
 * @param {object} data - Request body
 * @returns {{ isValid: boolean, errors: string[], sanitizedData?: object }}
 */
export const validateCreatePortfolio = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { isValid: false, errors: ['Request payload must be a JSON object.'] };
  }

  // Personal Info validation
  if (!data.personalInfo || typeof data.personalInfo !== 'object' || Array.isArray(data.personalInfo)) {
    errors.push('personalInfo object is required.');
  } else {
    const fullName = data.personalInfo.fullName;
    if (typeof fullName !== 'string' || fullName.trim().length === 0) {
      errors.push('personalInfo.fullName is required and must be a non-empty string.');
    }

    if (data.personalInfo.email && typeof data.personalInfo.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.personalInfo.email.trim())) {
        errors.push('personalInfo.email must be a valid email address.');
      }
    }
  }

  // Template validation
  if (data.template !== undefined && !ALLOWED_TEMPLATES.includes(data.template)) {
    errors.push(`Invalid template '${data.template}'. Allowed templates: ${ALLOWED_TEMPLATES.join(', ')}.`);
  }

  // Mode validation
  if (data.mode !== undefined && !ALLOWED_MODES.includes(data.mode)) {
    errors.push(`Invalid mode '${data.mode}'. Allowed modes: ${ALLOWED_MODES.join(', ')}.`);
  }

  // Array validations
  if (data.projects !== undefined && !Array.isArray(data.projects)) {
    errors.push('projects must be an array.');
  }
  if (data.experience !== undefined && !Array.isArray(data.experience)) {
    errors.push('experience must be an array.');
  }
  if (data.education !== undefined && !Array.isArray(data.education)) {
    errors.push('education must be an array.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Prepare sanitized copy with normalized slug
  const sanitized = { ...data };
  if (sanitized.slug) {
    sanitized.slug = sanitizeSlug(sanitized.slug);
  }
  if (!sanitized.slug) {
    const baseName = sanitized.personalInfo?.fullName || 'portfolio';
    const cleanBase = sanitizeSlug(baseName) || 'portfolio';
    sanitized.slug = `${cleanBase}-${Date.now().toString().slice(-4)}`;
  }

  return { isValid: true, errors: [], sanitizedData: sanitized };
};
