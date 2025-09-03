import React from 'react'
import CodeModal from '@/app/components/shadcn-ui/CodeModal'


const DafaultTextareacode = () => {
  return (
    <>
      <CodeModal>
        {`  
import { Textarea } from "@/app/components/shadcn-ui/Default-Ui/textarea";

 <Textarea placeholder="Type your message here." />
                `}
      </CodeModal>
    </>
  )
}

export default DafaultTextareacode