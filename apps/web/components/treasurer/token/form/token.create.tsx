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
import { useForm } from "react-hook-form";
import { Token, tokenSchema } from "./schema";

const defaultValues: Token = {
  amount: "",
};

const TokenCreateForm = () => {
  const form = useForm({
    resolver: zodResolver(tokenSchema()),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: any) => {
    console.log(data, "data");
  };
  return (
    <div className="my-6">
      <Card className="rounded-lg w-full">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 mb-5">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token</FormLabel>
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
                  >
                    Create
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenCreateForm;
