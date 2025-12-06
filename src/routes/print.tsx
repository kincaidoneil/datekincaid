import { createFileRoute } from "@tanstack/react-router"
import QRCode from "qrcode"
import { z } from "zod"

const EnvSchema = z.object({
  PHONE_NUMBER: z.e164(),
  VIP_CODES: z.string().transform((str) =>
    str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  ),
})

export const Route = createFileRoute("/print")({
  component: Page,
  head: () => ({
    meta: [
      {
        title: "Print Cards",
      },
    ],
  }),
  loader: () => {
    const env = EnvSchema.parse(process.env)
    return {
      phoneNumber: env.PHONE_NUMBER,
      vipCodes: env.VIP_CODES,
    }
  },
})

async function Page() {
  const { phoneNumber, vipCodes } = Route.useLoaderData()
  const qrCodes = await Promise.all(
    vipCodes
      .map((code) => `https://datekincaid.com?vip=${code}&phone=${phoneNumber}`)
      .map((url) =>
        QRCode.toDataURL(url, {
          width: 300,
          margin: 1,
          errorCorrectionLevel: "M",
        }),
      ),
  )

  return (
    <div className="h-full w-full bg-gray-100 p-5 print:bg-white print:p-0">
      <div className="mb-4 print:hidden font-sans text-sm">
        <p>Enable background graphics for cut guides</p>
        <p>Phone number: {phoneNumber}</p>
        <p>Codes: {vipCodes.join(", ")}</p>
      </div>

      <div className="h-[11in] w-[8.5in] shadow-lg print:shadow-none">
        <div className="mx-auto grid h-full w-full grid-flow-row grid-cols-3 grid-rows-6 gap-px bg-gray-50">
          {Array.from({ length: 18 }).map((_, index) => (
            <div
              key={index}
              className="relative flex flex-row items-end justify-end bg-white p-6">
              {qrCodes[index] && <img src={qrCodes[index]} className="h-16" />}
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @page {
            size: letter;
            margin: 0;
          }
        `}
      </style>
    </div>
  )
}
