import fs from 'fs';
import path from 'path';
import glob from 'glob';
import yargs from 'yargs';

yargs
  .command('flatten', 'Flatten the generated code.', () => {
    const generated = path.resolve(__dirname, '..', 'src', 'generated');
    const globbed = glob.sync('**/*', { cwd: path.join(generated) });
    const files = globbed.filter((item) => {
      const stats = fs.statSync(path.join(generated, item));
      return stats.isFile();
    });

    const directories = globbed.filter((item) => {
      const stats = fs.statSync(path.join(generated, item));
      return stats.isDirectory();
    });

    files.forEach((item) => {
      const from = path.join(generated, item);
      const to = path.join(generated, path.basename(item));
      fs.renameSync(from, to);
    });

    directories.forEach((item) => {
      fs.rmdirSync(path.join(generated, item), { recursive: true });
    });
  })
  .command('test', 'Test', () => {
    // Available Accounts
    // ==================
    // (0) 0x80A56bA436AC85920C891b7e16d4aAbE8685d331 (10000000000000 ETH)
    // (1) 0x461851F55a2862cbC48bD90E377966D0c07a7149 (10000000000000 ETH)
    // (2) 0xdCCD0B0B6e7416113E182db861903D5ACFE806B5 (10000000000000 ETH)
    // (3) 0xcaE23EEe50E2db8Ed9c78537D55CFA8c3f90C019 (10000000000000 ETH)
    // (4) 0x61AC6430CBcEB607d5f94939F26738d31727a101 (10000000000000 ETH)
    // (5) 0xF7Ce3aE991704f7F8c2591d93dC67b08cc779C2C (10000000000000 ETH)
    // (6) 0xD59e880a6174ea5f706D4daE92a089A59aA306E5 (10000000000000 ETH)
    // (7) 0xA8513F062BB1AC93286a9F9aA0A82dad0741Ab42 (10000000000000 ETH)
    // (8) 0xB57bAdc094f6B65d4eF2f4f1C4eD753242C2ab84 (10000000000000 ETH)
    // (9) 0xB913AEE9F0dc6C158f435F58626D2AC7E2d4bcDf (10000000000000 ETH)
    //
    // Private Keys
    // ==================
    // (0) 0x6e0af74d04c2194b77eabea74b611db65aa219f2014d26fc88c9a8abba8ce40f
    // (1) 0x46ff62fdaa404327f2d4abcdcd8b452f484b9d880aa33792eff5c274b2f0e6db
    // (2) 0xdc6efd1bdeba49b8b1b1dbfefff7d675f53a4a66bb5259b02915db0212145431
    // (3) 0xc0d7398dd5750dc905fba2e4ab84fcfa5c4909f7a8be1a488764b0c46c48826f
    // (4) 0xd516ff158bf2600a4cdd2df31bcbbd77985626ce9b53005e2ba85bb1d13ee053
    // (5) 0xc8b6c94dfc23ea05512344b21f12afb552dcb6a5bcc939ea9800d3fbf83a4859
    // (6) 0x39a61b085fd88bca26f5fa5e35093ee10b435404c984ea93919a3f9dad709563
    // (7) 0x9f4696ea71eb0186d8926ddb163aa3f5362b604932adab093d2fd804da9a01e1
    // (8) 0x7ce5e166cf121f46d5b3a6c7d39a1d6aed2fb187734ab59687163e8c30703b5a
    // (9) 0xeb461f27858a6fde81058c17cfb36ea03e5e4610a410a10c04ba59e59892014b
  })
  .help().argv;
