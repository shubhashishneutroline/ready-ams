import React from "react";

interface ServiceCardProps {
  serviceName: string;
  description: string;
  duration: string | number;
  status: string | boolean;
  visibility: string | boolean;
  createdBy: string;
  createdAt: string;
}

export const ServiceCardView: React.FC<{ data: ServiceCardProps[] }> = ({ data }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((service, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-4 border hover:shadow-xl transition-all duration-300"
        >
          <h3 className="text-xl font-bold text-gray-800">
            {service.serviceName}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{service.description}</p>

          <div className="text-sm space-y-1">
            <p>
              <strong>Duration:</strong> {service.duration}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`${
                  service.status === "active" || service.status === true
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {String(service.status).toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Visibility:</strong>{" "}
              {service.visibility ? "Visible" : "Hidden"}
            </p>
            <p>
              <strong>Created By:</strong> {service.createdBy}
            </p>
            <p>
              <strong>Created At:</strong> {service.createdAt}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
