import { MDX } from "@/components/blog-mdx";
import { Icons } from "@/components/icons";
import BlurImage from "@/components/ui/blur-image";
import { getBlurDataURL } from "@/lib/image";
import { constructMetadata, formatDate } from "@/lib/utils";
import { ChangelogPost, allChangelogPosts } from "contentlayer/generated";
import Link from "next/link";

export const metadata = constructMetadata({
    title: "Changelog - Loglib",
    description:
        "All the latest updates, improvements, and fixes to loglib - the privacy first open source web analytics.",
    image: "https://loglib.io/api/og/changelog",
});

export default async function Changelog() {
    return (
        <div className="mx-auto max-w-screen-xl md:px-20">
            <div className="relative grid border-b border-gray-200 py-20 md:grid-cols-4">
                <div className="md:col-span-1" />
                <div className="mx-5 flex flex-col space-y-6 md:col-span-3 md:mx-0">
                    <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                        Changelog
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-200">
                        All the latest updates, improvements, and fixes to Loglib.
                    </p>
                </div>
                <div className="absolute bottom-2 right-0 flex items-center space-x-2">
                    <p className="text-sm text-gray-500">Subscribe to updates →</p>
                    <Link
                        href="https://twitter.com/loglib_io"
                        className="rounded-full bg-blue-100 p-2 transition-colors hover:bg-blue-200"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icons.twitter className="h-4 w-4 text-[#1d9bf0] fill-black" />
                    </Link>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {allChangelogPosts
                    .filter((post) => !post.draft)
                    .sort((a, b) => {
                        if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
                            return -1;
                        }
                        return 1;
                    })
                    .map((post, idx) => (
                        <div key={post._id} className="grid py-20 md:grid-cols-4 md:px-5 xl:px-0">
                            <div className="sticky top-10 hidden self-start md:col-span-1 md:block">
                                <Link href={`/changelog/${post.slug}`}>
                                    <time
                                        dateTime={post.publishedAt}
                                        className="text-gray-500 transition-colors hover:"
                                    >
                                        {formatDate(post.publishedAt)}
                                    </time>
                                </Link>
                            </div>
                            <div className="md:col-span-3">
                                <div className="flex flex-col gap-6">
                                    <Link href={`/changelog/${post.slug}`}>
                                        {/* @ts-ignore */}
                                        <BlurredImage post={post} idx={idx} />
                                    </Link>
                                    <Link
                                        href={`/changelog/${post.slug}`}
                                        className="group mx-5 flex items-center space-x-3 md:mx-0"
                                    >
                                        <time
                                            dateTime={post.publishedAt}
                                            className="text-sm text-gray-500 transition-all group-hover: md:hidden"
                                        >
                                            {formatDate(post.publishedAt)}
                                        </time>
                                    </Link>
                                    <Link href={`/changelog/${post.slug}`} className="mx-5 md:mx-0">
                                        <h2 className="font-display text-3xl font-bold tracking-tight  hover:underline hover:decoration-1 hover:underline-offset-4 md:text-4xl">
                                            {post.title}
                                        </h2>
                                    </Link>
                                    <MDX code={post.body.code} />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

async function BlurredImage({ post, idx }: { post: ChangelogPost; idx: number }) {
    const blurDataURL = await getBlurDataURL(post.image);
    return (
        <BlurImage
            src={post.image}
            alt={post.title}
            width={1200}
            height={900}
            priority={idx === 0} // since it's above the fold
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="border border-gray-100 dark:border-stone-800 md:rounded-2xl"
        />
    );
}
