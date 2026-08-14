import type { Address } from "../lib/types";

export const savedAddresses: Address[] = [
  {
    id: "addr-home",
    label: "Home",
    name: "Ananya Mehta",
    phone: "+91 98250 11420",
    line1: "12, Satellite Road",
    line2: "Near ISKCON",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380015",
  },
  {
    id: "addr-kitchen",
    label: "Kitchen",
    name: "Spice Route Kitchen",
    phone: "+91 79 4000 2211",
    line1: "3rd floor, Heritage Plaza",
    line2: "CG Road, Navrangpura",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380009",
  },
];

export const emptyAddress = (): Address => ({
  id: `addr-${Date.now()}`,
  label: "New",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "Ahmedabad",
  state: "Gujarat",
  pincode: "",
});
