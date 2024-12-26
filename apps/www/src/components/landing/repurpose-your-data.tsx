"use client";
import Link from "next/link";
import Background from "./grid-background/background";

export const RepurposeYourData = () => {
    return (
        <section className=" w-full bg-stone-950 ">
            <Background />
            <div className="border-y border-stone-900 py-16 md:py-20 relative">
                <div
                    className=" bg-[#303a75]  border-t border-stone-800 transition-all duration-500 w-full absolute bottom-0 blur-md"
                    id="border"
                ></div>
                <div className="max-w-screen-lg px-6 mx-auto grid md:grid-cols-2 gap-12">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-none">
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-50">
                            Repurpose Your Data
                        </h2>
                        <p className="text-base font-normal tracking-normal max-w-lg mt-4 text-neutral-400 leading-7">
                            <span className="text-neutral-200 text-medium">
                                One of the reasons loglib was created was because we couldn&apos;t
                                find a decent option that allowed us to repurpose the data they
                                collected at the time. So we developed an embeddable one where you
                                can grab your own data from your database, but if you use the hosted
                                version, either self-deployed or on loglib.io, you lose that
                                ability, so we made sure you can access it through api just like
                                it&apos;s in your database.
                            </span>{" "}
                        </p>
                        <Link
                            href="/docs/api"
                            className="border border-neutral-300 text-neutral-300 hover:bg-neutral-300 hover:text-black transition-all focus:ring focus:ring-purple-light ring-offset-1 ring-offset-black px-3 py-2 mt-6 rounded text-sm font-medium group inline-flex items-center"
                        >
                            See API docs
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 20 20"
                                className="relative transition–all duration-200 left-0.5 group-focus:left-1 group-hover:left-1 w-4 h-4 ml-1"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </Link>
                    </div>
                    <div className="relative aspect-square mx-auto order-1 md:order-none">
                        <div className="absolute inset-0 blur-2xl scale-110 rounded-full animate-spin-slow bg-gradient-to-tl from-stone-800 to-stone-500 opacity-40"></div>
                        <div className="p-px bg-gradient-to-t from-stone-800/60 to-stone-700/60 rounded-3xl overflow backdrop-blur-sm">
                            <div className="bg-black/30 grid place-items-center p-7 md:p-12 rounded-3xl ">
                                <svg
                                    width="71"
                                    height="71"
                                    viewBox="0 0 71 71"
                                    fill="none"
                                    className="h-20 md:h-32 w-20 md:w-32 fill-stone-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M35.5 65.0834C31.4076 65.0834 27.5618 64.3064 23.9625 62.7522C20.3632 61.1981 17.2323 59.0908 14.5698 56.4303C11.9073 53.7678 9.79993 50.6369 8.24779 47.0376C6.69565 43.4383 5.9186 39.5924 5.91663 35.5001C5.91663 31.4077 6.69368 27.5619 8.24779 23.9626C9.8019 20.3633 11.9092 17.2324 14.5698 14.5699C17.2323 11.9074 20.3632 9.80005 23.9625 8.24792C27.5618 6.69578 31.4076 5.91872 35.5 5.91675C39.5923 5.91675 43.4382 6.6938 47.0375 8.24792C50.6368 9.80203 53.7677 11.9093 56.4302 14.5699C59.0927 17.2324 61.201 20.3633 62.7551 23.9626C64.3092 27.5619 65.0853 31.4077 65.0833 35.5001V59.1667C65.0833 60.7938 64.5035 62.1872 63.3438 63.3469C62.1841 64.5065 60.7917 65.0854 59.1666 65.0834H35.5ZM35.5 59.1667C42.1069 59.1667 47.7031 56.874 52.2885 52.2886C56.8739 47.7032 59.1666 42.107 59.1666 35.5001C59.1666 28.8931 56.8739 23.297 52.2885 18.7115C47.7031 14.1261 42.1069 11.8334 35.5 11.8334C28.893 11.8334 23.2968 14.1261 18.7114 18.7115C14.126 23.297 11.8333 28.8931 11.8333 35.5001C11.8333 36.6341 11.9073 37.7435 12.0552 38.8282C12.2031 39.9129 12.425 40.973 12.7208 42.0084L21.7437 32.9855C21.9902 32.739 22.2861 32.5417 22.6312 32.3938C22.9763 32.2459 23.3461 32.1473 23.7406 32.098C24.0857 32.098 24.4309 32.1601 24.776 32.2844C25.1211 32.4086 25.4416 32.593 25.7375 32.8376L33.4291 39.272L43.1177 29.5834H41.4166C40.5784 29.5834 39.8753 29.2994 39.3073 28.7314C38.7393 28.1634 38.4563 27.4613 38.4583 26.6251C38.4583 25.7869 38.7423 25.0838 39.3103 24.5158C39.8783 23.9478 40.5804 23.6648 41.4166 23.6667H50.2916C51.1298 23.6667 51.8329 23.9507 52.4009 24.5187C52.9689 25.0867 53.2519 25.7889 53.25 26.6251V35.5001C53.25 36.3383 52.966 37.0414 52.398 37.6094C51.83 38.1774 51.1278 38.4604 50.2916 38.4584C49.4534 38.4584 48.7503 38.1744 48.1823 37.6064C47.6143 37.0384 47.3313 36.3363 47.3333 35.5001V33.799L35.6479 45.4105C35.4013 45.657 35.1055 45.8542 34.7604 46.0022C34.4152 46.1501 34.0701 46.224 33.725 46.224C33.3305 46.2733 32.9607 46.2359 32.6156 46.1116C32.2704 45.9874 31.95 45.803 31.6541 45.5584L24.0364 39.0501L15.3093 47.7772C17.3802 51.1792 20.1787 53.9285 23.7051 56.025C27.2314 58.1215 31.163 59.1687 35.5 59.1667ZM57.6875 60.6459C58.5257 60.6459 59.2287 60.3619 59.7967 59.7939C60.3647 59.2259 60.6478 58.5238 60.6458 57.6876C60.6458 56.8494 60.3618 56.1463 59.7938 55.5783C59.2258 55.0103 58.5237 54.7273 57.6875 54.7292C56.8493 54.7292 56.1462 55.0132 55.5782 55.5812C55.0102 56.1492 54.7272 56.8514 54.7291 57.6876C54.7291 58.5258 55.0131 59.2289 55.5811 59.7969C56.1491 60.3649 56.8512 60.6479 57.6875 60.6459Z"
                                        fill="#DDDDDD"
                                        className="fill-black/80 dark:fill-[#DDDDDD]"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
