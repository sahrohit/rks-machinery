import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { PROD } from "~/constants";

const OPTIONS = ["default", "primary", "success", "warning", "danger"];

type OptionsType = "default" | "primary" | "success" | "warning" | "danger";

const PageLoader = ({ label }: { label?: string }) => {
  const [color, setColor] = useState<OptionsType>("success");

  useEffect(() => {
    const interval = setInterval(
      () =>
        setColor(
          OPTIONS[Math.floor(Math.random() * OPTIONS.length)] as OptionsType
        ),
      1000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid h-screen w-full place-items-center">
      <Spinner
        label={!PROD ? label : undefined}
        color={color}
        labelColor="foreground"
      />
    </div>
  );
};

export default PageLoader;
