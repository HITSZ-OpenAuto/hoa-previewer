interface tabbarProps {
  fileTitle: string;
}

export default function Tabbar(props: tabbarProps) {
  return (
    <div className="w-screen min-h-18 max-h-18 flex flex-col sticky z-10 shadow-2xs justify-center md:justify-between items-stretch md:items-center px-2 md:flex-row md:px-24 top-0 bg-white/90 dark:bg-slate-950/90">
      <div className="z-20 flex items-center gap-2 text-black pt-4 pb-1 md:p-0">
        <img src="/src/assets/logo.webp" alt="HOA" className="w-6 h-6" />
        <a
          className="font-bold text-md hover:text-black dark:text-white"
          href="https://hoa.moe/"
        >
          HITSZ 自动化课程攻略共享计划
        </a>
      </div>
      <div className="font-bold text-xs md:text-md md:mr-16 text-right">
        {props.fileTitle}
      </div>
    </div>
  );
}
