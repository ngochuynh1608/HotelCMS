export const config = {
  matcher: "/reservation",
};

export default function middleware(request) {
  if (request.method === "POST") {
    return Response.redirect(new URL("/reservation", request.url), 303);
  }
}
