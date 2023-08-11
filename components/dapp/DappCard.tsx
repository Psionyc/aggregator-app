import { FunctionComponent } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface DappCardProps {
    title?: string;
    description?: string;
}

const DappCard: FunctionComponent<DappCardProps> = ({ title, description }: DappCardProps) => {
    return (<Card className="bg-transparent text-white border-primary">
        <CardHeader>
            <CardTitle>{title ?? `OrderBook Trade`}</CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
            <p>{description ?? `Lorem ipsum dolor sit amet consectetur adipisicing elit.
             Modi illum non corporis aliquam rerum optio officiis qui distinctio vero,
             sequi repellat eligendi quod nobis sint tenetur molestiae, earum totam perspiciatis!`}</p>
        </CardContent>
        <CardFooter>
            <div className="flex justify-end w-full">
                <Button className="bg-[#68E4FF] text-black text-[16px]  gap-2">Open Dapp <ExternalLink/></Button>
            </div>
        </CardFooter>

    </Card>);
}

export default DappCard;