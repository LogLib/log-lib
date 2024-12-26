"use client";
import { Spacer } from "@nextui-org/react";
import { sectionWrapper } from "../primitive";
import { FeaturesGrid } from "./feature-grid";
import { communityAccounts } from "@/lib/social-constant";
export const Community = () => {
    return (
        <section
            className={sectionWrapper({
                class: "flex flex-col items-center",
            })}
        >
            <div className="max-w-full flex flex-col gap-8">
                <div>
                    <Spacer y={12} />

                    <div className="max-w-6xl">
                        <FeaturesGrid
                            classNames={{
                                base: "lg:grid-cols-4 ",
                                iconWrapper: "bg-transparent ",
                                body: "pt-0 ",
                            }}
                            features={communityAccounts}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
