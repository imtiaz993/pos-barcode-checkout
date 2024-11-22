import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import POS from "./pos";

const App = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return user && <POS />;
};

export default App;
