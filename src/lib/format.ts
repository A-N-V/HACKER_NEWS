import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const timeAgo = (unixSeconds?: number) =>
  unixSeconds ? dayjs.unix(unixSeconds).fromNow() : "";

export const fullDate = (unixSeconds?: number) =>
  unixSeconds ? dayjs.unix(unixSeconds).format("D MMM YYYY, HH:mm") : "";

export const getDomain = (url?: string) => {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

export const pluralize = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;
