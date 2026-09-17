export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeContactFields(fields: ContactFields): ContactFields {
  return {
    name: fields.name.trim(),
    email: fields.email.trim().toLowerCase(),
    phone: fields.phone.trim(),
    message: fields.message.trim(),
  };
}

export function validateContactFields(fields: ContactFields): ContactFieldErrors {
  const normalized = normalizeContactFields(fields);
  const errors: ContactFieldErrors = {};

  if (!normalized.name) {
    errors.name = "Please enter your name.";
  }

  if (!normalized.email) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(normalized.email)) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
}
