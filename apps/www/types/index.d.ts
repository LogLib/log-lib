import { User } from "@loglib/types/models";

import { Icons } from "@/components/icons";

export type MainNavItem = NavItem;

export type NavLink = {
    title: string;
    href: string;
    disabled?: boolean;
    dynamic?: boolean;
};

export type SidebarNavItem = {
    title: string;
    disabled?: boolean;
    external?: boolean;
    label?: string;
    icon?: keyof typeof Icons;
    useInclude?: boolean;
} & (
    | {
          href: string;
          items?: never;
      }
    | {
          href?: string;
          items: NavLink[];
      }
);

export type SiteConfig = {
    name: string;
    description: string;
    url: string;
    ogImage: string;
    links: {
        twitter: string;
        github: string;
    };
};

export type DocsConfig = {
    mainNav: MainNavItem[];
    sidebarNav: SidebarNavItem[];
};
export type DashboardConfig = {
    sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
    name: string;
    description: string;
    stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
    Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
        stripeCurrentPeriodEnd: number;
        isPro: boolean;
    };
