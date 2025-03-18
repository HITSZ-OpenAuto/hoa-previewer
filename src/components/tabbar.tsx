interface tabbarProps {
  fileTitle: string;
}

export default function Tabbar(props: tabbarProps) {
  return (
    <div className="w-screen min-h-18 max-h-18 flex sticky z-10 shadow-2xs justify-between items-center px-24 top-0 bg-white/90">
      <div className="z-20 flex gap-2 text-black">
        <img src="/src/assets/logo.webp" alt="HOA" className="w-6 h-6" />
        <a
          className="font-bold text-md hover:text-black"
          href="https://hoa.moe/"
        >
          HITSZ 自动化课程攻略共享计划
        </a>
      </div>
      <div className="font-bold text-md mr-16">{props.fileTitle}</div>
    </div>
  );
}
