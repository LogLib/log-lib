import { Icons } from "@/components/icons";
import { getHostName } from "@/lib/utils";
import {
	ArrowUpRight,
	Facebook,
	Github,
	Instagram,
	Laptop,
	Link,
	Linkedin,
	Mail,
	Twitch,
	Youtube,
} from "lucide-react";

export const RefIcons = {
	vercel: () => (
		<svg
			width="16"
			height="18"
			viewBox="0 0 76 65"
			className=" dark:fill-white fill-black"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
		</svg>
	),
	github: () => <Github size={18} />,
	twitter: () => (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className=" w-4 h-4 dark:fill-white"
		>
			<g>
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
			</g>
		</svg>
	),
	"x [ex: twitter]": () => (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className=" w-4 h-4 dark:fill-white"
		>
			<g>
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
			</g>
		</svg>
	),
	x: () => (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className=" w-4 h-4 dark:fill-white"
		>
			<g>
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
			</g>
		</svg>
	),
	direct: () => <ArrowUpRight size={18} />,
	facebook: () => <Facebook size={18} />,
	google: () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			width={17}
		>
			<path
				d="M19.76 10.77L19.67 10.42H12.23V13.58H16.68C16.4317 14.5443 15.8672 15.3974 15.0767 16.0029C14.2863 16.6084 13.3156 16.9313 12.32 16.92C11.0208 16.9093 9.77254 16.4135 8.81999 15.53C8.35174 15.0685 7.97912 14.5191 7.72344 13.9134C7.46777 13.3077 7.33407 12.6575 7.33 12C7.34511 10.6795 7.86792 9.41544 8.79 8.47002C9.7291 7.58038 10.9764 7.08932 12.27 7.10002C13.3779 7.10855 14.4446 7.52101 15.27 8.26002L17.47 6.00002C16.02 4.70638 14.1432 3.9941 12.2 4.00002C11.131 3.99367 10.0713 4.19793 9.08127 4.60115C8.09125 5.00436 7.19034 5.59863 6.43 6.35002C4.98369 7.8523 4.16827 9.85182 4.15152 11.9371C4.13478 14.0224 4.918 16.0347 6.34 17.56C7.12784 18.3449 8.06422 18.965 9.09441 19.3839C10.1246 19.8029 11.2279 20.0123 12.34 20C13.3484 20.0075 14.3479 19.8102 15.2779 19.42C16.2078 19.0298 17.0488 18.4549 17.75 17.73C19.1259 16.2171 19.8702 14.2347 19.83 12.19C19.8408 11.7156 19.8174 11.2411 19.76 10.77Z"
				fill="#fff"
			></path>
		</svg>
	),
	telegram: () => (
		<svg
			width="18px"
			className=" stroke-black stroke-2 dark:stroke-white fill-none"
			height="18px"
			viewBox="0 0 48 48"
			id="Layer_2"
			data-name="Layer 2"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M40.83,8.48c1.14,0,2,1,1.54,2.86l-5.58,26.3c-.39,1.87-1.52,2.32-3.08,1.45L20.4,29.26a.4.4,0,0,1,0-.65L35.77,14.73c.7-.62-.15-.92-1.07-.36L15.41,26.54a.46.46,0,0,1-.4.05L6.82,24C5,23.47,5,22.22,7.23,21.33L40,8.69a2.16,2.16,0,0,1,.83-.21Z" />
		</svg>
	),
	instagram: () => <Instagram size={16} />,
	loglib: () => <Icons.logo className=" h-4 w-4 md:h-4 md:w-4" />,
	android: () => (
		<svg
			viewBox="0 0 24 24"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			className="w-5 h-5"
			fill="#000000"
		>
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g
				id="SVGRepo_tracerCarrier"
				strokeLinecap="round"
				strokeLinejoin="round"
			></g>
			<g id="SVGRepo_iconCarrier">
				{" "}
				<title>Android_2_line</title>{" "}
				<g
					id="页面-1"
					stroke="none"
					strokeWidth="1"
					fill="none"
					fill-rule="evenodd"
				>
					{" "}
					<g
						id="Logo"
						transform="translate(0.000000, -96.000000)"
						fill-rule="nonzero"
					>
						{" "}
						<g id="Android_2_line" transform="translate(0.000000, 96.000000)">
							{" "}
							<path
								d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
								id="MingCute"
								fill-rule="nonzero"
							>
								{" "}
							</path>{" "}
							<path
								d="M18.4472,4.10555 C18.9412,4.35254 19.1414,4.95321 18.8944,5.44719 L17.7199,7.79629 C20.3074,9.60378 22,12.6042 22,16 L22,17 C22,18.1045 21.1046,19 20,19 L4,19 C2.89543,19 2,18.1045 2,17 L2,16 C2,12.6042 3.69258,9.60377 6.28012,7.79629 L5.10557,5.44719 C4.85858,4.95321 5.05881,4.35254 5.55279,4.10555 C6.04676,3.85856 6.64744,4.05878 6.89443,4.55276 L8.02799,6.81988 C9.24552,6.29237 10.5886,5.99997 12,5.99997 C13.4114,5.99997 14.7545,6.29237 15.972,6.81988 L17.1056,4.55276 C17.3526,4.05878 17.9532,3.85856 18.4472,4.10555 Z M12,7.99998 C7.58172,7.99998 4,11.5817 4,16 L4,17 L20,17 L20,16 C20,11.5817 16.4183,7.99998 12,7.99998 Z M8.5,12 C9.32843,12 10,12.6715 10,13.5 C10,14.3284 9.32843,15 8.5,15 C7.67157,15 7,14.3284 7,13.5 C7,12.6715 7.67157,12 8.5,12 Z M15.5,12 C16.3284,12 17,12.6715 17,13.5 C17,14.3284 16.3284,15 15.5,15 C14.6716,15 14,14.3284 14,13.5 C14,12.6715 14.6716,12 15.5,12 Z"
								id="形状"
								className=" fill-black dark:fill-white"
							>
								{" "}
							</path>{" "}
						</g>{" "}
					</g>{" "}
				</g>{" "}
			</g>
		</svg>
	),
	localhost: () => <Laptop size={18} />,
	youtube: () => <Youtube size={18} />,
	linkedin: () => <Linkedin size={17} />,
	default: () => <Link size={18} />,
	twitch: () => <Twitch size={18} />,
	gmail: () => <Mail size={18} />,
	mail: () => <Mail size={18} />,
};

export const RenderIcon = ({ icon }: { icon: string }) => {
	const Icon = RefIcons[icon];
	return <Icon />;
};

export const DefaultIcons = ({ url }: { url: string }) => {
	const hostName = getHostName(url);
	return (
		<img
			alt=""
			src={`https://icons.duckduckgo.com/ip3/${hostName}.ico`}
			width={18}
			height={18}
		/>
	);
};
