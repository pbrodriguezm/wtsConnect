import * as Yup from "yup";

import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import { Company } from "../../models/Company";
import User from "../../models/User";

interface Request {
  email: string;
  password: string;
  name: string;
  queueIds?: number[];
  profile?: string;
  whatsappId?: number;
  companyId?: number;
}

interface Response {
  email: string;
  name: string;
  id: number;
  profile: string;
}

const CreateUserService = async ({
  email,
  password,
  name,
  queueIds = [],
  profile = "admin",
  whatsappId,
  companyId
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().required().min(2),
    email: Yup.string()
      .email()
      .required()
      .test(
        "Check-email",
        "Ya existe un usuario con este correo electrónico.",
        async value => {
          if (!value) return false;
          const emailExists = await User.findOne({
            where: { email: value }
          });
          return !emailExists;
        }
      ),
    password: Yup.string().required().min(5)
  });

  try {
    await schema.validate({ email, password, name });
  } catch (err) {
    throw new AppError(err.message);
  }
  if(queueIds.length === 0){
    throw new AppError("Debe seleccionar almenos un área");
  }

  const user = await User.create(
    {
      email,
      password,
      name,
      profile,
      whatsappId: whatsappId ? whatsappId : null,
      companyId

    },
    { include: ["queues", "whatsapp"] }
  );
  

  await user.$set("queues", queueIds);

  await user.reload();
  let newUser 
  return SerializeUser(newUser?newUser:user);
};

export default CreateUserService;
