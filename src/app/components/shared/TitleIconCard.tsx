"use client";

import { Card, Button } from "flowbite-react";
import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import { CustomizerContext } from "@/app/context/CustomizerContext";

interface TitleCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  onDownload?: () => void;
}

const TitleIconCard: React.FC<TitleCardProps> = ({
  children,
  className,
  title,
  onDownload,
}) => {
  const { activeMode, isCardShadow, isBorderRadius } =
    useContext(CustomizerContext);

  return (
    <Card
      className={`card ${className} ${
        isCardShadow
          ? "dark:shadow-dark-md shadow-md p-0"
          : "shadow-none border border-ld p-0"
      }`}
      style={{
        borderRadius: `${isBorderRadius}px`,
      }}
    >
      <div className="flex justify-between items-center border-b border-ld px-6 py-4">
        <h5 className="text-xl font-semibold">{title}</h5>

        <Button
          className="flex items-center"
          size="sm"
          color="primary"
          onClick={onDownload}
        >
          <Icon
            icon="solar:download-minimalistic-bold-duotone"
            width={20}
            height={20}
          />
        </Button>
      </div>
      <div className="pt-4 p-6">{children}</div>
    </Card>
  );
};

export default TitleIconCard;
