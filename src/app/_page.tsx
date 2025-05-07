// import { Button } from "@/components/ui/button"
// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   SignUpButton,
//   useUser,
// } from "@clerk/nextjs"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"

// const HomePage = () => {
//   const { isSignedIn, user } = useUser()
//   const router = useRouter()

//   // Redirect based on role after sign-in
//   useEffect(() => {
//     if (isSignedIn && user) {
//       const role = user.publicMetadata.role || "user"
//       const intendedRedirect = role === "admin" ? "/admin" : "/"
//       router.push(intendedRedirect)
//     }
//   }, [isSignedIn, user, router])

//   return (
//     <div className="flex items-center gap-4 flex-col h-screen justify-center">
//       <SignedOut>
//         <Button asChild>
//           <SignInButton mode="modal" afterSignInUrl="/">
//             Sign In as User
//           </SignInButton>
//         </Button>
//         <Button asChild variant="outline">
//           <SignInButton mode="modal" afterSignInUrl="/admin">
//             Sign In as Admin
//           </SignInButton>
//         </Button>
//         <Button asChild variant="secondary">
//           <SignUpButton mode="modal" afterSignUpUrl="/" />
//         </Button>
//       </SignedOut>
//       <SignedIn>
//         <p>Redirecting...</p>
//       </SignedIn>
//     </div>
//   )
// }

// export default HomePage
