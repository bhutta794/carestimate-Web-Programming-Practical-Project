import { withAuth } from "next-auth/middleware";

export const config = {
  matcher: ["/sell"],
};

export default withAuth({
  pages: {
    signIn: "/login",
  },
});