export function validateTasting(data) {
  const errors = [];

  if (!data.coffeeName || typeof data.coffeeName !== "string" || !data.coffeeName.trim()) {
    errors.push("Coffee name is required.");
  }

  if (!data.roaster || typeof data.roaster !== "string" || !data.roaster.trim()) {
    errors.push("Roaster is required.");
  }

  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    errors.push("Rating must be a whole number between 1 and 5.");
  }

  return errors;
}
