import { useState } from "react";

export default function useForm({ initialValues }) {
  const [values, setValues] = useState(initialValues || {});

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setValues({
      ...values,
      [name]: value,
    });
  };

  return {
    handleChange,
    values,
  };
}
