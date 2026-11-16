import "dotenv/config";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "mobilix_super_secret_key",
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      if (jwtPayload.role === "ADMIN") {
        const admin = await prisma.admin.findUnique({
          where: { id: jwtPayload.userId },
        });
        if (admin) {
          const { password: _, ...adminWithoutPassword } = admin;
          return done(null, { ...adminWithoutPassword, role: "ADMIN" });
        }
      }

      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.userId },
      });
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name,
              email,
              password: "GOOGLE_OAUTH_USER_NO_PASSWORD",
              role: "CUSTOMER",
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
