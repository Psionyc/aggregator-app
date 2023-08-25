const TokenDivider = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-row items-center gap-2  text-white font-medium">
            <div className="w-full h-[1px] bg-white/50"></div>
            {children}
            <div className="w-full h-[1px] bg-white/50"></div>
        </div>
    )
}

export default TokenDivider;