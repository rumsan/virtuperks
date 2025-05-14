import { DialogButton } from "@/components/common/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Token, tokenSchema } from "../../token/form/schema";

const defaultValues: Token = {
  amount: "",
};
interface DepartmentListProps {
  router: AppRouterInstance;
}

const DepartmentTokenAllocate = ({ router }: DepartmentListProps) => {
  console.log("Router: ", router);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(tokenSchema()),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: Token) => {
    console.log(data, "data");
  };

  const handleDialogButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <div className="my-6">
      <Card className="rounded-lg w-full">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 mb-5">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Token Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Write token amount"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full flex justify-end gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-[170px] flex justify-center items-center gap-2"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      history.back();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    className="w-[170px] flex justify-center items-center gap-2"
                    onClick={(e) => handleDialogButton(e)}
                  >
                    Allocate
                  </Button>

                  {isOpen && (
                    <DialogButton
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      title={"Allocate Token"}
                      subTitle={
                        "Are you sure you want to confirm this token alloation?"
                      }
                      buttonName={"Confirm"}
                    />
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentTokenAllocate;
