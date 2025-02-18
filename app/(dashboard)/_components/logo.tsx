import Image from "next/image";

export const Logo = () => {
    return ( 
        <div>
            <Image height={130} width={130} alt="logo" src={"/logo.jpg"}/>
        </div>
     );
}
 
