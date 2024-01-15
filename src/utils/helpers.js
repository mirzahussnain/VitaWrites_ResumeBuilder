import { Template_1, Template_2, Template_3 } from "../components/designs";

export const adminIds=import.meta.env.VITE_REACT_APP_ADMIN_IDS;

export const initialTags = [
    "Software Engineer",
    "Front-end Developer",
    "Back-end Developer",
    "Full-stack Developer",
    "Web Developer",
    "UI/UX Designer",
    "Graphic Designer",
    "Data Scientist",
    "Product Manager",
    "Project Manager",
    "Business Analyst",
    "Marketing Manager",
    "Sales Representative",
    "Customer Service Representative",
    "HR Manager",
    "Financial Analyst",
    "Content Writer",
    "Teacher/Educator",
    "Healthcare Professional",
    "Legal Counsel",
  ];

  export const FiltersData = [
    { id: "1", label: "Software Engineer", value: "Software Engineer" },
    { id: "2", label: "Front-end Developer", value: "Front-end Developer" },
    { id: "3", label: "Back-end Developer", value: "Back-end Developer" },
    { id: "4", label: "Full-stack Developer", value: "Full-stack Developer" },
    { id: "5", label: "Web Developer", value: "Web Developer" },
    { id: "6", label: "UI/UX Designer", value: "UI/UX Designer" },
    { id: "7", label: "Graphic Designer", value: "Graphic Designer" },
    { id: "8", label: "Data Scientist", value: "Data Scientist" },
    { id: "9", label: "Product Manager", value: "Product Manager" },
    { id: "10", label: "Project Manager", value: "Project Manager" },
    { id: "11", label: "Business Analyst", value: "Business Analyst" },
    { id: "12", label: "Marketing Manager", value: "Marketing Manager" },
    { id: "13", label: "Sales Representative", value: "Sales Representative" },
    {
      id: "14",
      label: "Customer Service Representative",
      value: "customer_service_representative",
    },
    { id: "15", label: "HR Manager", value: "hr_manager" },
    { id: "16", label: "Financial Analyst", value: "financial_analyst" },
    { id: "17", label: "Content Writer", value: "content_writer" },
    { id: "18", label: "Teacher/Educator", value: "teacher_educator" },
    {
      id: "19",
      label: "Healthcare Professional",
      value: "healthcare_professional",
    },
    { id: "20", label: "Legal Counsel", value: "legal_counsel" },
  ];

  export const TemplatesData=[
    {id:`template-${Date.now()}`,name:"Template-1",component:Template_1},
    {id:`template-${Date.now()}`,name:"Template-2",component:Template_2},
    {id:`template-${Date.now()}`,name:"Template-3",component:Template_3},
  ];

  export const percentageConverter=(percentage)=>{
    // Ensure percentage is between 0 and 100
    percentage = Math.min(100, Math.max(0, percentage));

    // Convert percentage to a number between 1 and 5
    const rating = Math.ceil((percentage / 100) * 5);


  // Ensure the result is between 0 and 5
  return Math.min(5, Math.max(0, rating));
  }