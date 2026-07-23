const TEST_FILES = [
  'src/modules/auth/auth.test.ts',
  'src/modules/tags/tags.test.ts',
  'src/modules/spots/spots.test.ts',
  'src/modules/users/users.test.ts',
  'src/modules/reviews/reviews.test.ts',
  'src/modules/vault/vault.test.ts',
]

let passCount = 0
let failCount = 0

for (const file of TEST_FILES) {
  console.log(`\n${'='.repeat(56)}`)
  console.log(`  📁 ${file}`)
  console.log(`${'='.repeat(56)}`)

  try {
    const proc = Bun.spawn(['bun', 'run', file], {
      stdio: ['ignore', 'inherit', 'inherit'],
      env: { ...process.env },
    })
    const exitCode = await proc.exited

    if (exitCode === 0) {
      passCount++
    } else {
      console.log(`  ⚠️  File exited with code ${exitCode}`)
      failCount++
    }
  } catch (e: any) {
    console.log(`  💥 Failed to run: ${e.message}`)
    failCount++
  }
}

console.log(`\n${'='.repeat(56)}`)
console.log(`  📊 Results: ${passCount} passed, ${failCount} failed`)
console.log(`${'='.repeat(56)}\n`)

process.exit(failCount > 0 ? 1 : 0)
