import { Team, TeamMember, User } from "@loglib/types/models";

export type TeamWithUsers = Team & {
    TeamUser: (TeamMember & {
        User: User;
    })[];
};
