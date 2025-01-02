"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { submitForm } from "@/lib/utils";

// Define the schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d+$/, "Phone number must contain only numbers")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  level: yup.string().required("Level is required"),
  dateOfFlight: yup.date().required("Date of flight is required"),
  timeOfArrival: yup.string().required("Time of arrival is required"),
  status: yup
    .string()
    .oneOf(["found", "still looking"], "Status must be 'found' or 'still looking'")
    .required("Status is required"),
}).required();

export type FormData = yup.InferType<typeof schema>;

export default function Form() {
  const [submitting, setSubmitting] = useState(false); // State to track submission status
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true); // Set submitting state to true
    try {
      const documentId = await submitForm(data);

      localStorage.setItem(
        "formSubmission",
        JSON.stringify({ ...data, id: documentId })
      );

      console.log("Form submitted and saved to local storage!");
      alert("Form submitted successfully! Move to Board Page to see other students...");

      document.querySelector("form")?.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false); // Reset submitting state to false
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:px-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col lg:w-1/2">
          <label className="uppercase mb-2">Name</label>
          <input {...register("name")} className="border focus:border border-black rounded-lg py-2 px-2" />
          <p className="text-red-500 text-xs">{errors.name?.message}</p>
        </div>

        <div className="flex flex-col lg:w-1/2">
          <label className="uppercase mb-2">Email</label>
          <input type="email" {...register("email")} className="border focus:border border-black rounded-lg py-2 px-2" />
          <p className="text-red-500 text-xs">{errors.email?.message}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 flex flex-col">
          <label className="uppercase mb-2">Phone Number</label>
          <input type="text" {...register("phoneNumber")} className="border focus:border border-black rounded-lg py-2 px-2" />
          <p className="text-xs text-red-500">{errors.phoneNumber?.message}</p>
        </div>

        <div className="flex flex-col lg:w-1/2">
          <label className="mb-2">Level</label>
          <input {...register("level")} className="border focus:border border-black rounded-lg py-2 px-2" />
          <p className="text-xs text-red-500">{errors.level?.message}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col lg:w-1/2">
          <label className="uppercase mb-2">Date of Flight</label>
          <input type="date" {...register("dateOfFlight")} className="border focus:border border-black rounded-lg py-2 px-2" />
          <p className="text-xs text-red-500">{errors.dateOfFlight?.message}</p>
        </div>

        <div className="flex flex-col lg:w-1/2">
          <label className="uppercase mb-2">Time of Arrival</label>
          <input type="time" {...register("timeOfArrival")} className="border focus:border border-black rounded-lg py-2 px-2" />
          <p className="text-xs text-red-500">{errors.timeOfArrival?.message}</p>
        </div>
      </div>

      <div className="flex flex-col lg:w-[48.5%]">
        <label className="uppercase mb-2">Status</label>
        <select {...register("status")} className="border focus:border border-black rounded-lg py-2 px-2">
          <option value="">Select status</option>
          <option value="found">Found</option>
          <option value="still looking">Still looking</option>
        </select>
        <p className="text-xs text-red-500">{errors.status?.message}</p>
      </div>

      <button
        type="submit"
        className={`bg-slate-600 text-white rounded-lg py-2 font-semibold mt-4 ${
          submitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={submitting} // Disable button while submitting
      >
        {submitting ? "Submitting..." : "Submit"} {/* Show feedback */}
      </button>
    </form>
  );
}
