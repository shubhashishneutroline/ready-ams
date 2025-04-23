import React from "react"

interface HeadingProps {
  title: string
  description: string
  icon: React.ReactNode
}

const Heading = ({ title, description, icon }: HeadingProps) => {
  return (
    <div className=" px-2 py-4 pt-0  text-white text-shadow-lg drop-shadow-2xl ">
      <div className="flex  items-center gap-2 ">
        <span className="text-xl md:text-2xl lg:text-3xl font-semibold ">
          {title}
        </span>
        <span className="">{icon}</span>
      </div>
      <p className="text-sm lg:text-base">{description}</p>
    </div>
  )
}

export default Heading
