import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {handlers, signIN, signOut, auth} = NextAuth({
    providers:[Google],
})




// chat gpt wala code tala xa




// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   secret: process.env.AUTH_SECRET,
// };

// const handler = NextAuth(authOptions);


// export { handler as GET, handler as POST };
