import { CometCard } from "@/components/ui/comet-card";

export default function CometCardDemo() {
  return (
    <CometCard>
      <button
        type="button"
        className="my-6 flex w-64 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 saturate-0 md:my-12 md:p-3"
        aria-label="Card"
        style={{
          transformStyle: "preserve-3d",
          transform: "none",
          opacity: 1,
        }}
      >
        <div className="mx-2 flex-1">
          <div className="relative mt-2 aspect-[3/4] w-full">
            <img
              loading="lazy"
              className="absolute inset-0 h-full w-full rounded-[16px] bg-[#000000] object-cover contrast-75"
              alt="Card image"
              src="https://images.unsplash.com/photo-1505506874110-6a7a69069a08?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                opacity: 1,
              }}
            />
          </div>
        </div>

        {/* Keep minimal footer inside the card (optional). If the existing hero previously had text,
            DO NOT move that hero text here. */}
        <div className="mt-2 flex flex-shrink-0 items-center justify-between p-3 font-mono text-white">
          <div className="text-xs">Comet Card</div>
          <div className="text-xs text-gray-300 opacity-50">#0001</div>
        </div>
      </button>
    </CometCard>
  );
}
