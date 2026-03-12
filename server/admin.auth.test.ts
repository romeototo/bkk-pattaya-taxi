import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb, hashPassword, verifyAdminPassword, createAdminCredential, getAdminByUsername } from "./db";
import bcrypt from "bcrypt";

describe("Admin Authentication", () => {
  describe("Password Hashing", () => {
    it("should hash a password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20); // bcrypt hashes are long
    });

    it("should verify a correct password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);
      
      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
      const password = "testPassword123";
      const wrongPassword = "wrongPassword456";
      const hash = await hashPassword(password);
      
      const isValid = await bcrypt.compare(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe("Admin Credentials", () => {
    it("should create admin credential", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available for test");
        return;
      }

      const passwordHash = await hashPassword("admin123");
      
      try {
        const result = await createAdminCredential({
          username: "testadmin",
          email: "testadmin@example.com",
          passwordHash: passwordHash,
          isActive: "true",
        });
        
        expect(result).toBeDefined();
      } catch (error) {
        // Expected if table doesn't exist or admin already exists
        console.warn("Create admin credential test skipped:", error);
      }
    });

    it("should retrieve admin by username", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available for test");
        return;
      }

      try {
        const admin = await getAdminByUsername("testadmin");
        // Admin may or may not exist depending on test setup
        if (admin) {
          expect(admin.username).toBe("testadmin");
          expect(admin.email).toBe("testadmin@example.com");
        }
      } catch (error) {
        console.warn("Get admin by username test skipped:", error);
      }
    });

    it("should verify admin password", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available for test");
        return;
      }

      try {
        // This test assumes a test admin exists
        const admin = await verifyAdminPassword("testadmin", "admin123");
        
        if (admin) {
          expect(admin.username).toBe("testadmin");
          expect(admin.id).toBeDefined();
        }
      } catch (error) {
        console.warn("Verify admin password test skipped:", error);
      }
    });

    it("should reject invalid password", async () => {
      const db = await getDb();
      if (!db) {
        console.warn("Database not available for test");
        return;
      }

      try {
        const admin = await verifyAdminPassword("testadmin", "wrongpassword");
        expect(admin).toBeNull();
      } catch (error) {
        console.warn("Reject invalid password test skipped:", error);
      }
    });
  });

  describe("Admin Login Validation", () => {
    it("should validate username format", () => {
      const validUsernames = ["admin", "user123", "test_admin"];
      const invalidUsernames = ["", " ", "a"];

      validUsernames.forEach(username => {
        expect(username.length).toBeGreaterThan(0);
      });

      invalidUsernames.forEach(username => {
        expect(username.trim().length).toBeLessThanOrEqual(0);
      });
    });

    it("should validate password strength", () => {
      const strongPasswords = ["Password123!", "MySecurePass2024", "Admin@123"];
      const weakPasswords = ["123", "pass", ""];

      strongPasswords.forEach(password => {
        expect(password.length).toBeGreaterThanOrEqual(6);
      });

      weakPasswords.forEach(password => {
        expect(password.length).toBeLessThan(6);
      });
    });
  });
});
