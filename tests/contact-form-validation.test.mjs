import assert from "node:assert/strict";
import test from "node:test";

import { normalizeContactFields, validateContactFields } from "../src/lib/form-validation.ts";

test("rejects a blank contact name", () => {
  assert.deepEqual(
    validateContactFields({ name: "   ", email: "person@example.com", phone: "", message: "" }),
    { name: "Please enter your name." }
  );
});

test("rejects a malformed contact email", () => {
  assert.deepEqual(
    validateContactFields({ name: "Rahul", email: "not-an-email", phone: "", message: "" }),
    { email: "Please enter a valid email address." }
  );
});

test("reports both required contact fields when both are invalid", () => {
  assert.deepEqual(
    validateContactFields({ name: "", email: "", phone: "", message: "" }),
    {
      name: "Please enter your name.",
      email: "Please enter your email address.",
    }
  );
});

test("trims contact fields before submission", () => {
  assert.deepEqual(
    normalizeContactFields({
      name: "  Rahul Singh  ",
      email: "  Rahul@Example.COM ",
      phone: "  +91 95129 00744  ",
      message: "  Please share details.  ",
    }),
    {
      name: "Rahul Singh",
      email: "rahul@example.com",
      phone: "+91 95129 00744",
      message: "Please share details.",
    }
  );
});
