import { Label, TextInput } from "flowbite-react";
import React from "react";
import TitleCard from "../../shared/TitleBorderCard";

const InputVariants = () => {
  return (
    <div>
      <TitleCard title="Input Variants">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-gray" color="gray" value="Gray" />
            </div>
            <TextInput
              id="input-gray"
              placeholder="Input Gray"
              className="form-rounded"
              required
              color="gray"
            />
          </div>
          <div className="col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-info" color="info" value="Info" />
            </div>
            <TextInput
              id="input-info"
              placeholder="Input Info"
              className="form-rounded"
              required
              color="info"
            />
          </div>
          <div className="col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-success" color="success" value="Success" />
            </div>
            <TextInput
              id="input-success"
              placeholder="Input Success"
              required
              color="success"
              className="form-rounded"
            />
          </div>
          <div className="col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-failure" color="failure" value="Failure" />
            </div>
            <TextInput
              id="input-failure"
              placeholder="Input Failure"
              required
              color="failure"
              className="form-rounded"
            />
          </div>
          <div className="col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="input-warning" color="warning" value="Warning" />
            </div>
            <TextInput
              id="input-warning"
              placeholder="Input Warning"
              required
              color="warning"
              className="form-rounded"
            />
          </div>
        </div>
      </TitleCard>
    </div>
  );
};

export default InputVariants;
