import { RedirectType, redirect } from "next/navigation";

export function Redirect({
  url,
  redirectType,
}: {
  url: string;
  redirectType?: RedirectType;
}) {
  redirect(url, redirectType);

  return null;
}
