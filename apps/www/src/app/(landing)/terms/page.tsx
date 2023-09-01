import { Metadata } from "next";
import { constructMetadata } from "@/lib/utils";
import LegalPage from "@/components/legal";
import { allLegalPosts } from "contentlayer/generated";

export const metadata: Metadata = constructMetadata({
    title: "Terms of Service – Dub",
});

export default function Terms() {
    const post = allLegalPosts.find((post) => post.slug === "terms");
    if (!post) throw new Error("No terms of service found");
    return <LegalPage post={post} />;
}
