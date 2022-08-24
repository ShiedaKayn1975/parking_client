import { serviceAgent } from "../../api";
import { AxiosClient } from "../BaseResource";

class Resource {
  constructor(code) {
    this.client =  new AxiosClient({
      client: serviceAgent,
      resourceName: code
    })
  }
}

export default Resource