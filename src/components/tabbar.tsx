interface tabbarProps {
  fileTitle: string
}

export default function Tabbar(props: tabbarProps) {
  return (
    <div className="absolute top-0 left-0 z-10 flex max-h-16 min-h-16 w-screen flex-col items-stretch justify-center bg-white/90 px-2 shadow-2xs md:flex-row md:items-center md:justify-between md:px-24 dark:bg-slate-950/90">
      <div className="z-20 flex items-center gap-2 pt-4 pb-1 text-black md:p-0">
        <img src="/logo.webp" alt="HOA" className="h-5 w-5" />
        <a
          className="text-md font-bold hover:opacity-75 dark:text-white"
          href="https://hoa.moe/"
        >
          HITSZ 自动化课程攻略共享计划
        </a>
      </div>
      <div className="md:text-md text-right text-xs font-bold md:mr-16">
        {props.fileTitle}
      </div>
    </div>
  )
}
