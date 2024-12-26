import Changelog from "@/components/changelog";
import { TwitterXIcons } from "@/components/extra-icons";
import { FeatureAccordion } from "@/components/landing/feature-accordion";
import { FeatureCard } from "@/components/landing/feature-cards";
import { HeroSection } from "@/components/landing/hero";
import ProjectsContents from "@/components/landing/project-preview";
import { RepurposeYourData } from "@/components/landing/repurpose-your-data";
import { Community } from "@/components/marketing/community";
import { getCurrentUser } from "@/lib/session";
import { TrackView } from "@loglib/tracker/react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface ContributorsProps {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    contributions: number;
}

async function getPackageInfo(packageName: string) {
    try {
        const response = await fetch(`https://registry.npmjs.org/${packageName}`);
        const packageData = await response.json();
        const { version, dist } = packageData.versions[packageData["dist-tags"].latest];
        const packageSize = dist.unpackedSize;
        return {
            version,
            packageSize: Math.floor(packageSize / 1024),
        };
    } catch (error) {
        console.error(`Error fetching package info: ${error}`);
    }
}

async function getGitHubContributors() {
    try {
        const response = await fetch("https://api.github.com/repos/loglib/loglib/contributors", {
            next: {
                revalidate: 60,
            },
        });

        if (!response?.ok) {
            return null;
        }
        const contributorsData: ContributorsProps = await response.json();
        return contributorsData;
    } catch (e) {
        console.log("Error while fetching contributors: ", e);
    }
}
async function getGitHubStars() {
    try {
        const response = await fetch("https://api.github.com/repos/loglib/loglib", {
            next: {
                revalidate: 60,
            },
        });
        if (!response?.ok) {
            return null;
        }
        const json = await response.json();
        const stars = parseInt(json.stargazers_count).toLocaleString();
        return stars;
    } catch {
        return null;
    }
}
async function getGitHubForks() {
    return await fetch("https://api.github.com/repos/loglib/loglib/forks", {
        method: "GET",
        redirect: "follow",
        next: {
            revalidate: 60,
        },
    })
        .then((response) => response.text())
        .then((result) => JSON.parse(result).length)
        .catch((error) => console.log("error", error));
}

export default async function IndexPage() {
    const stars = await getGitHubStars();
    const forks = await getGitHubForks();
    const user = await getCurrentUser();
    const npm = await getPackageInfo("@loglib/tracker");

    if (user) {
        return redirect("/dashboard");
    }

    return (
        <main className="grid place-items-center space-y-10 md:space-y-20">
            <HeroSection />
            <FeatureCard />
            <FeatureAccordion />
            <section className="w-full">
                <RepurposeYourData />
                <section className="w-full">
                    <Changelog />
                </section>
            </section>
            <div className="hidden md:block">
                <ProjectsContents
                    gitForks={forks}
                    githubStars={stars ? parseInt(stars) : 100}
                    npmSize={npm?.packageSize ?? 1}
                    npmVersion={npm?.version ?? "0.6.2"}
                />
            </div>
            {/* <div className="sm:py-18 container relative mx-auto px-6 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20">
        <TwitterTestimonial />
      </div> */}
            <section className="max-w-8xl to-50 flex-col mx-auto mt-10 w-full rounded-3xl flex  md:flex-row md:justify-between justify-center md:items-start items-center  bg-gradient-to-br from-gray-100 px-4 dark:from-stone-950/80 dark:to-[#080812] sm:px-16">
                <div className="flex h-min px-2  flex-col justify-center gap-8 py-12">
                    <h1 className="font-heading max-w-3xl text-3xl font-bold sm:text-6xl">
                        Supported by{" "}
                        <span className="from-logo bg-gradient-to-br to-orange-600 bg-clip-text font-black uppercase text-transparent">
                            Dope{" "}
                        </span>
                        #community
                    </h1>
                    <Community />
                </div>
            </section>
            <TrackView
                name="footer-reached"
                payload={{
                    from: "landing page",
                }}
            >
                <footer className=" border-t !w-full py-10 my-9 justify-between flex items-center">
                    <div className=" flex  gap-2 text-sm font-medium items-center">
                        <Link href="/privacy" className=" underline">
                            <span>Privacy</span>
                        </Link>
                        <span className=" w-1 h-1 rounded-full bg-stone-200" />
                        <Link href="/terms" className=" underline">
                            <span>Terms</span>
                        </Link>
                    </div>
                    <span className="  text-stone-300 font-light text-sm">
                        {new Date().getFullYear()} © Loglib
                    </span>

                    <div className=" flex items-center gap-2">
                        <Link href="https://twiiter.com/loglib_io">
                            <TwitterXIcons width={15} height={15} size={15} />
                        </Link>
                        <Link href="https://github.com/loglib">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                role="img"
                                focusable="false"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.5127 1.96247C10.4401 1.32066 9.27013 0.999756 7.99946 0.999756C6.72987 0.999756 5.5588 1.32066 4.48573 1.96247C3.41428 2.60373 2.56465 3.4742 1.939 4.57333C1.31228 5.67358 1 6.87335 1 8.17542C1 9.73858 1.44527 11.1441 2.33528 12.393C3.22529 13.6398 4.37482 14.5063 5.78494 14.9843C5.94862 15.0156 6.0703 14.9938 6.14891 14.9189C6.22806 14.8435 6.26736 14.7512 6.26736 14.6394L6.26306 14.1334C6.25983 13.8159 6.25767 13.5391 6.25767 13.3021L6.04877 13.339C5.91524 13.3642 5.74617 13.3748 5.54265 13.3714C5.33967 13.3686 5.12807 13.3468 4.90947 13.306C4.69249 13.2658 4.4895 13.173 4.30105 13.0265C4.11261 12.88 3.97908 12.6882 3.89993 12.4518L3.8084 12.236C3.7481 12.0928 3.65226 11.9341 3.52196 11.7607C3.39112 11.5852 3.25921 11.4667 3.12568 11.4046L3.06107 11.3582C3.01908 11.3269 2.98031 11.29 2.94262 11.2464C2.90655 11.2028 2.87962 11.1592 2.86186 11.1156C2.84355 11.0708 2.85809 11.0356 2.90655 11.0077C2.955 10.9786 3.0433 10.9657 3.17037 10.9657L3.35343 10.9937C3.47404 11.0183 3.6248 11.0932 3.80409 11.2173C3.98339 11.3426 4.13091 11.5041 4.2456 11.7037C4.38559 11.9587 4.55411 12.1532 4.75171 12.2874C4.94931 12.4216 5.14853 12.4886 5.34936 12.4886C5.54857 12.4886 5.72248 12.4719 5.86839 12.4417C6.01377 12.4104 6.15107 12.3634 6.27759 12.3019C6.33359 11.8837 6.48219 11.5628 6.72448 11.3386C6.37882 11.3006 6.06761 11.2447 5.7914 11.1698C5.51465 11.0954 5.22929 10.9741 4.93531 10.8053C4.63918 10.6376 4.39528 10.4296 4.20091 10.1791C4.00708 9.93202 3.84717 9.60329 3.72333 9.20076C3.59949 8.79431 3.5365 8.32861 3.5365 7.79861C3.5365 7.04554 3.77556 6.40373 4.25583 5.87373C4.03077 5.30683 4.05123 4.67173 4.32044 3.9673C4.49542 3.91139 4.75656 3.95332 5.1033 4.09309C5.4495 4.23286 5.70256 4.35306 5.86355 4.45201C6.02507 4.55265 6.1543 4.63651 6.25121 4.70471C6.81494 4.54594 7.39751 4.46599 7.99946 4.46599C8.60142 4.46599 9.18399 4.54706 9.74933 4.70863L10.0955 4.48388C10.3324 4.33461 10.6124 4.19876 10.9344 4.07297C11.2574 3.94885 11.504 3.91475 11.6742 3.97066C11.9472 4.67508 11.9719 5.30963 11.7469 5.87708C12.2261 6.40597 12.4662 7.04778 12.4662 7.8014C12.4662 8.33029 12.4037 8.79935 12.2794 9.20747C12.1555 9.61559 11.994 9.94432 11.7959 10.1898C11.5988 10.4357 11.3533 10.6426 11.0582 10.8114C10.7637 10.9792 10.4767 11.1005 10.2021 11.1748C9.92539 11.2498 9.61526 11.3057 9.26744 11.3426C9.58349 11.6221 9.74125 12.0638 9.74125 12.6692V14.6411C9.74125 14.7529 9.77894 14.8457 9.8554 14.9206C9.93077 14.995 10.0508 15.0173 10.2151 14.986C11.6257 14.5052 12.7747 13.642 13.6647 12.3919C14.5547 11.1452 15 9.73802 15 8.17542C15 6.87391 14.6866 5.67358 14.061 4.57389C13.4348 3.47476 12.5857 2.60429 11.5143 1.96303L11.5127 1.96247Z"
                                ></path>
                            </svg>
                        </Link>
                        <Link href="https://t.me/loglib_community">
                            <svg
                                viewBox="0 0 24 24"
                                className=" w-6 h-6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M12 4C10.4178 4 8.87103 4.46919 7.55544 5.34824C6.23985 6.22729 5.21447 7.47672 4.60897 8.93853C4.00347 10.4003 3.84504 12.0089 4.15372 13.5607C4.4624 15.1126 5.22433 16.538 6.34315 17.6569C7.46197 18.7757 8.88743 19.5376 10.4393 19.8463C11.9911 20.155 13.5997 19.9965 15.0615 19.391C16.5233 18.7855 17.7727 17.7602 18.6518 16.4446C19.5308 15.129 20 13.5823 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4ZM15.93 9.48L14.62 15.67C14.52 16.11 14.26 16.21 13.89 16.01L11.89 14.53L10.89 15.46C10.8429 15.5215 10.7824 15.5715 10.7131 15.6062C10.6438 15.6408 10.5675 15.6592 10.49 15.66L10.63 13.66L14.33 10.31C14.5 10.17 14.33 10.09 14.09 10.23L9.55 13.08L7.55 12.46C7.12 12.33 7.11 12.03 7.64 11.83L15.35 8.83C15.73 8.72 16.05 8.94 15.93 9.48Z"
                                        fill="#fff"
                                    ></path>
                                </g>
                            </svg>
                        </Link>
                        <Link href="https://discord.gg/SPjPCsED">
                            <svg
                                className=" w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M18.59 5.88997C17.36 5.31997 16.05 4.89997 14.67 4.65997C14.5 4.95997 14.3 5.36997 14.17 5.69997C12.71 5.47997 11.26 5.47997 9.83001 5.69997C9.69001 5.36997 9.49001 4.95997 9.32001 4.65997C7.94001 4.89997 6.63001 5.31997 5.40001 5.88997C2.92001 9.62997 2.25001 13.28 2.58001 16.87C4.23001 18.1 5.82001 18.84 7.39001 19.33C7.78001 18.8 8.12001 18.23 8.42001 17.64C7.85001 17.43 7.31001 17.16 6.80001 16.85C6.94001 16.75 7.07001 16.64 7.20001 16.54C10.33 18 13.72 18 16.81 16.54C16.94 16.65 17.07 16.75 17.21 16.85C16.7 17.16 16.15 17.42 15.59 17.64C15.89 18.23 16.23 18.8 16.62 19.33C18.19 18.84 19.79 18.1 21.43 16.87C21.82 12.7 20.76 9.08997 18.61 5.88997H18.59ZM8.84001 14.67C7.90001 14.67 7.13001 13.8 7.13001 12.73C7.13001 11.66 7.88001 10.79 8.84001 10.79C9.80001 10.79 10.56 11.66 10.55 12.73C10.55 13.79 9.80001 14.67 8.84001 14.67ZM15.15 14.67C14.21 14.67 13.44 13.8 13.44 12.73C13.44 11.66 14.19 10.79 15.15 10.79C16.11 10.79 16.87 11.66 16.86 12.73C16.86 13.79 16.11 14.67 15.15 14.67Z"
                                        fill="#fff"
                                    ></path>
                                </g>
                            </svg>
                        </Link>
                    </div>
                </footer>
            </TrackView>
        </main>
    );
}
