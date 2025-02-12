// import { Input } from "@workspace/ui/components/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@workspace/ui/components/select";
// import { Controller, useFormContext } from "react-hook-form";

// interface TokenValueFieldProps {
//   tokenType: string;
//   tokenAmount: string;
//   disabled?: boolean;
// }

// export const TypeTokenField: React.FC<TokenValueFieldProps> = ({
//   tokenType,
//   tokenAmount,
//   disabled,
// }) => {
//   const { control, setError, clearErrors, getValues } = useFormContext();

//   const validateFields = () => {
//     const type = getValues(tokenType);
//     const amount = getValues(tokenAmount);

//     if (!type) {
//       setError(tokenType, { message: "Token Type is required." });
//       setError(tokenAmount, { message: "" });
//       return;
//     }

//     if (!amount) {
//       setError(tokenAmount, { message: "Amount is required." });
//       setError(tokenType, { message: "" });
//       return;
//     }

//     if (Number(amount) <= 0) {
//       setError(tokenAmount, { message: "Amount must be greater than 0." });
//       setError(tokenType, { message: "" });
//       return;
//     }

//     // Clear errors when all validations pass
//     clearErrors([tokenType, tokenAmount]);
//   };
//   return (
//     <div className="flex">
//       <Controller
//         name={tokenType}
//         control={control}
//         render={({ field }) => (
//           <Select
//             value={field.value}
//             onValueChange={(value) => {
//               field.onChange(value);
//               validateFields();
//             }}
//             disabled={disabled}
//           >
//             <SelectTrigger className="w-[120px] rounded-r-none">
//               <SelectValue placeholder="Type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="NPR">NPR</SelectItem>
//               <SelectItem value="USD">USD</SelectItem>
//               <SelectItem value="GBP">GBP</SelectItem>
//             </SelectContent>
//           </Select>
//         )}
//       />
//       <Controller
//         name={tokenAmount}
//         control={control}
//         render={({ field }) => (
//           <Input
//             className="flex-1 rounded-l-none border-l-0 text-right"
//             type="number"
//             disabled={disabled}
//             {...field}
//             onChange={(e) => {
//               field.onChange(e.target.value);
//               validateFields();
//             }}
//           />
//         )}
//       />
//     </div>
//   );
// };
