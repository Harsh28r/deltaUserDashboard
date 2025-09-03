import { Spinner } from "flowbite-react";
import React from "react";
import CardBox from "../../shared/CardBox";
import CodeModal from "../CodeModal";

const DefaultSpinner = () => {
  return (
    <div>
      <CardBox>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">Default Spinner</h4>
          <CodeModal>
            {`
    import { Spinner } from "flowbite-react";
    <Spinner aria-label="Default status example" />
        `}
          </CodeModal>
        </div>

        <div>
          <Spinner aria-label="Default status example" />
        </div>
      </CardBox>
    </div>
  );
};

export default DefaultSpinner;
