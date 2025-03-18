import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import clsx from "clsx";
import { Check, Divide } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="">
			<section className="h-full w-full pt-20 md:pt-44 relative flex items-center justify-center flex-col">
				{/* grid */}
				<div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#222333_1px,transparent_1px),linear-gradient(to_bottom,#222333_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_90%)] -z-10" />

				{/* grid End */}
				<p className="text-center">Run your agency, in one place</p>
				<div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
					<h1 className="text-9xl font-bold text-center md:text-[300px]">
						Plura
					</h1>
				</div>
				<div className="flex justify-center items-center relative md:mt-[-70px]">
					<Image
						src={"/assets/preview.png"}
						alt="banner image"
						height={1200}
						width={1200}
						className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
					/>
					<div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
				</div>
			</section>

			<section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[60px]">
				<h2 className="text-4xl text-center capitalize">
					choose what fits you right
				</h2>
				<p className="text-muted-foreground text-center">
					our straigntforward pricing plans are tailored to meet your needs. if{" "}
					{" you're"} not <br /> ready to commit you can get started for free.
				</p>

				<div className="flex justify-center flex-wrap mt-6 gap-5">
					{pricingCards.map((card) => (
						// TODO: wire up free product from stripe
						<Card
							key={card.title}
							className={clsx("w-[300px] flex flex-col justify-between", {
								"border-2 border-primary": card.title === "Unlimited Saas",
							})}
						>
							<CardHeader>
								<CardTitle>{card.title}</CardTitle>
								<CardDescription>{card.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<span className="text-4xl font-bold">{card.price}</span>
							</CardContent>
							<CardFooter className="flex flex-col items-start gap-4">
								<div>
									{card.features.map((feature) => (
										<div key={feature} className="flex gap-2">
											<Check className="text-muted-foreground" />
											<p>{feature}</p>
										</div>
									))}
								</div>
								<Link
									href={`/agency?plan=${card.priceId}`}
									className={clsx(
										"w-full text-center bg-primary p-2 rounded-md ",
										{
											"!bg-muted-foreground": card.title !== "Unlimited Saas",
										}
									)}
								>
									Get Started
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
