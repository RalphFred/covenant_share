import Link from "next/link";

export default function Nav() {
  return (
    <nav className=" flex justify-between py-4">
    <Link href="/" className="text-2xl md:text-3xl font-bold">Covenant_Share</Link>
    <Link href="/board" className="font-semibold text-lg md:text-xl"> Board </Link>
  </nav>
  );
}