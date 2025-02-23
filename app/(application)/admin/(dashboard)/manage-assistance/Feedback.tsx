import axios from "axios";
import { useFormik } from "formik";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";
import * as Yup from "yup";

const Feedback = ({ setShowPopup }: any) => {
  const formik = useFormik({
    initialValues: {
      feedback: "",
    },
    validationSchema: Yup.object({
      feedback: Yup.string().required("Feedback is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axios.post(
          "https://www.adminapi.ecoboutiquemarket.com/feedback",
          {
            feedback: values.feedback,
          }
        );

        await axios.post("/api/firebase/set-admin", {
          uid: data.data.uid,
        });

        setShowPopup(false);
        toast.success("Feedback submitted successfully!");
      } catch (error: any) {
        toast.error(error.response.data.error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <div>
      {" "}
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
        <div className="bg-white border px-5 py-5 rounded-lg w-11/12 lg:w-1/3 transform transition-all min-w-96 max-w-lg sm:shadow-xl">
          <div className="flex justify-between mb-2">
            <h2 className="text-lg font-semibold">Feedback</h2>
            <button
              disabled={formik.isSubmitting}
              onClick={() => setShowPopup(false)}
            >
              <IoMdClose className="text-lg cursor-pointer" />
            </button>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <form onSubmit={formik.handleSubmit} className="mt-6">
                <label htmlFor="feedback" className="block text-sm font-medium">
                  Feedback
                </label>
                <div className="mt-2">
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formik.values.feedback}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full px-3 py-2 border resize-none ${
                      formik.touched.feedback && formik.errors.feedback
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg shadow-sm text-sm focus:outline-none`}
                  />
                </div>
                {formik.touched.feedback && formik.errors.feedback && (
                  <p className="text-red-500 text-sm mt-2">
                    {formik.errors.feedback}
                  </p>
                )}

                <button
                  type="submit"
                  className={`mt-6 w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition ${
                    formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Submitting ..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
