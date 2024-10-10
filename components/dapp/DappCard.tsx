import type { FunctionComponent } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card"
import { Button } from "@/components/shadcn-ui/button";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface DappCardProps {
    title?: string;
    description?: string;
    url?: string;
}

const DappCard: FunctionComponent<DappCardProps> = ({ title, description, url }: DappCardProps) => {
    return (<Card className="bg-transparent text-white border-primary">
        <CardHeader>
            <CardTitle>{title ?? "OrderBook Trade"}</CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
            <p>{description ?? `Lorem ipsum dolor sit amet consectetur adipisicing elit.
             Modi illum non corporis aliquam rerum optio officiis qui distinctio vero,
             sequi repellat eligendi quod nobis sint tenetur molestiae, earum totam perspiciatis!`}</p>
        </CardContent>
        <CardFooter>
            <div className="flex justify-end w-full">
              <Link href={ url ?? "/dapp"}>
              <Button className="bg-[#68E4FF] text-black text-[16px]  gap-2 hover:text-white">Open Dapp <ExternalLink /></Button>
              </Link>  
            </div>
        </CardFooter>

    </Card>);
}

export default DappCard;